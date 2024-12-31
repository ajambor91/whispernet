<?php

namespace App\Service;

use App\Entity\Mission;
use App\Entity\MissionTranslation;
use App\Enum\Lang;
use App\Repository\MissionRepository;
use Doctrine\ORM\EntityManagerInterface;

class MissionService
{

    private EntityManagerInterface $entityManager;
    private MissionRepository $missionRepository;

    public function __construct(MissionRepository $missionRepository, EntityManagerInterface $entityManager)
    {
        $this->missionRepository = $missionRepository;
        $this->entityManager = $entityManager;
    }

    public function setMissionPage(array $request): Mission  {
        $payload = $request['mission'];
        $missionData = $this->missionRepository->findAll();
        $mission = null;
        if (count($missionData) <= 0 ) {
            $mission = new Mission();
        } else {
            $mission = $missionData[count($missionData) - 1];
        }
        $mission->setTitle($payload['title'])
            ->setSubtitle($payload['subtitle'])
            ->setDescription($payload['description']);
        if (isset($payload['translation'])) {
            foreach ($payload['translation'] as $incomingTranslation) {
                $foundTranslation = null;
                foreach ($mission->getTranslation() as $existingTranslaion) {
                    if ($existingTranslaion->getCode()->value === $incomingTranslation['code']) {
                        $foundTranslation = $existingTranslaion;
                        break;
                    }
                }
                if ($foundTranslation) {
                    $foundTranslation->setTitle($incomingTranslation['title'])
                        ->setSubtitle($incomingTranslation['subtitle'])
                        ->setDescription($incomingTranslation['description'])
                        ->setMission($mission);
                }else {
                    $newMission = new MissionTranslation();
                    $newMission->setTitle($incomingTranslation['title'])
                        ->setSubtitle($incomingTranslation['subtitle'])
                        ->setDescription($incomingTranslation['description'])
                        ->setCode(Lang::from($incomingTranslation['code']))
                        ->setMission($mission);
                    $mission->addTranslation($newMission);
                }
            }
        }

        $this->entityManager->persist($mission);
        $this->entityManager->flush();
        return $mission;
    }


}