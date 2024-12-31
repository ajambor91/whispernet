<?php

namespace App\Controller\Dashboard;

use App\Entity\Feature;
use App\Form\FeatureType;
use App\Repository\FeatureRepository;
use App\Service\FeatureService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/dashboard/features')]
class FeaturesController extends AbstractController
{
    private FeatureRepository $featureRepository;
    private FeatureService $featureService;
    public function __construct(FeatureRepository $featureRepository, FeatureService $featureService)
    {
        $this->featureRepository = $featureRepository;
        $this->featureService = $featureService;
    }

    #[Route('/', name: 'features_page',methods: ["GET", "POST"])]
    public function featuresPage(Request $request): Response
    {
        $feature = null;
        if ($request->getMethod() === 'POST') {
            $feature = $this->featureService->setFeature($request->request->all());

        } else {
            $featureFromDB = $this->featureRepository->findAll();
            $feature = $featureFromDB ? $featureFromDB[count($featureFromDB) - 1] : new Feature();
        }
        $form = $this->createForm(FeatureType::class, $feature);

        return $this->render('features.html.twig', ['form' => $form->createView()]);
    }
}