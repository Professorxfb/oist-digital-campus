<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class CreateSuperAdmin extends Command
{
    protected $signature = 'oist:create-super-admin';

    protected $description = 'Create or promote a controlled OIST super admin user.';

    public function handle(): int
    {
        $name = trim((string) $this->ask('Name'));
        $email = trim((string) $this->ask('Email'));

        $emailValidator = Validator::make(['email' => $email], [
            'email' => ['required', 'email:rfc'],
        ]);

        if ($emailValidator->fails()) {
            $this->error('A valid email address is required.');

            return self::FAILURE;
        }

        if (! Role::query()->where('name', 'super_admin')->where('guard_name', 'web')->exists()) {
            $this->error('The super_admin role does not exist. Run: php artisan db:seed --class=RolePermissionSeeder');

            return self::FAILURE;
        }

        $user = User::query()->where('email', $email)->first();

        if ($user) {
            $this->warn('A user with this email already exists.');

            if (! $this->confirm('Assign the super_admin role to this existing user?', false)) {
                $this->info('No changes were made.');

                return self::SUCCESS;
            }
        } else {
            if ($name === '') {
                $this->error('Name is required when creating a new super admin.');

                return self::FAILURE;
            }

            $password = (string) $this->secret('Password (minimum 12 characters)');

            $passwordValidator = Validator::make(['password' => $password], [
                'password' => ['required', 'string', 'min:12'],
            ]);

            if ($passwordValidator->fails()) {
                $this->error('Password must be at least 12 characters.');

                return self::FAILURE;
            }

            $user = User::query()->create([
                'name' => $name,
                'email' => $email,
                'password' => $password,
            ]);

            $this->info('Super admin user created.');
        }

        $user->assignRole('super_admin');

        $this->info('The super_admin role has been assigned.');
        $this->info('Password was not printed or logged.');

        return self::SUCCESS;
    }
}
