<?php

namespace App\Service;
use App\Entity\Admin;
use App\Repository\AdminRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AdminService
{
    private UserPasswordHasherInterface $hasher;
    private EntityManagerInterface $entityManager;
    public function __construct(UserPasswordHasherInterface $hasher, EntityManagerInterface $entityManager)
    {
        $this->hasher = $hasher;
        $this->entityManager = $entityManager;
    }

    public function createUser(string $email, string $password)
    {
        $user = new Admin();
        $user->setEmail($email)
            ->setPassword($this->hasher->hashPassword($user, $password))
            ->setRoles(['ROLE_ADMIN']);
        $this->entityManager->persist($user);
        $this->entityManager->flush();


    }
}