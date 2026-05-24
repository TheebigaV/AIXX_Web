<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProjectInitialition extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:project-initialition';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Initializing The Project');

        $this->output->progressStart(10);

        $this->info('Start Migration');
        $this->call('migrate:fresh');
        $this->output->progressAdvance(6);

        $this->info('Permission Create');
        $this->call('app:sync-permissions-from-policies');
        $this->output->progressAdvance(2);

        $this->info('Super User Role Create');
        $this->call('app:create-super-admin-role');
        $this->output->progressAdvance(2);

        $this->output->progressFinish();
        $this->info('Project Initialization Completed');
    }
}
