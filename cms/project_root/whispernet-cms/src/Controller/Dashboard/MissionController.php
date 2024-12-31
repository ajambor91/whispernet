<?php

namespace App\Controller\Dashboard;

use App\Entity\Mission;
use App\Form\MissionType;
use App\Repository\MissionRepository;
use App\Service\MissionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/dashboard/mission')]
class MissionController extends AbstractController
{
    private MissionRepository $missionRepository;
    private MissionService $missionService;

    public function __construct(MissionRepository $missionRepository, MissionService $missionService)
    {
        $this->missionRepository = $missionRepository;
        $this->missionService = $missionService;
    }
    #[Route('/', name: 'mission_page',methods: ["GET", "POST"])]
    public function missionPage(Request $request): Response
    {
        $mission = null;
        if ($request->getMethod() === 'POST') {
            $mission = $this->missionService->setMissionPage($request->request->all());

        } else {
            $missionFromDB = $this->missionRepository->findAll();
            $mission = $missionFromDB ? $missionFromDB[count($missionFromDB) - 1] : new Mission();
        }
        $form = $this->createForm(MissionType::class, $mission);

        return $this->render('mission.html.twig', ['form' => $form->createView()]);
    }
}