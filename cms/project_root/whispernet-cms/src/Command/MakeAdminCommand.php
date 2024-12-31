<?php

namespace App\Command;
use App\Repository\AdminRepository;
use App\Service\AdminService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:make-admin')]
class MakeAdminCommand extends Command
{

    private AdminService $adminService;
    public function __construct(AdminService $adminService)
    {
        parent::__construct();
        $this->adminService = $adminService;
    }

    protected function configure(): void
    {
        $this->addArgument('email', InputArgument::REQUIRED, 'Type email')
            ->addArgument('password', InputArgument::REQUIRED, 'Type password');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $email = $input->getArgument('email');
        $password = $input->getArgument('password');
        if (!$email || !$password) {
            return Command::FAILURE;
        }
        $this->adminService->createUser($email, $password);
        return Command::SUCCESS;

    }
}