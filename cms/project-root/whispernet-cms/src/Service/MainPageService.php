<?php
namespace App\Service;

use App\Entity\Main;
use App\Entity\MainTranslate;
use App\Enum\Lang;
use App\Repository\MainRepository;
use Doctrine\ORM\EntityManagerInterface;

class MainPageService
{
    private EntityManagerInterface $entityManager;
    private MainRepository $mainRepository;
    public function __construct(EntityManagerInterface $entityManager, MainRepository $mainRepository){
        $this->entityManager = $entityManager;
        $this->mainRepository = $mainRepository;
    }
    public function setMainPage(array $request): Main  {
        $payload = $request['main_page'];
        $mainData = $this->mainRepository->findAll();
        $main = null;
        if (count($mainData) <= 0 ) {
            $main = new Main();
        } else {
            $main = $mainData[count($mainData) - 1];
        }
        $main->setTitle($payload['title'])
            ->setSubtitle($payload['subtitle'])
            ->setDescription($payload['description']);
        if ($payload['translate']) {
            $main = $this->addTranslation($main, $payload['translate']);
        }
        $this->entityManager->persist($main);
        $this->entityManager->flush();
        return $main;
    }

    private function addTranslation(Main $main, array $translates): Main
    {
        $existingTranslates = $main->getTranslate();
        foreach ($translates as $translate) {
                $foundTranslation = null;
                foreach ($existingTranslates as $existingTranslate) {
                    if ($existingTranslate->getCode()->value === $translate['code']) {
                        $foundTranslation = $existingTranslate;
                        break;
                    }
                }
                if ($foundTranslation) {
                    $foundTranslation->setTitle($translate['title'])
                                    ->setSubtitle($translate['subtitle'])
                                    ->setDescription($translate['description']);
                } else {
                    $mainTranslate = new MainTranslate();
                    $mainTranslate->setMain($main)
                                    ->setTitle($translate['title'])
                                    ->setDescription($translate['description'])
                                    ->setSubtitle($translate['subtitle'])
                                    ->setCode(Lang::from($translate['code']));
                    $main->addTranslate($mainTranslate);
                }

        }
        return $main;
    }
}