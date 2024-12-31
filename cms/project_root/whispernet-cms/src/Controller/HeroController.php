<?php
namespace App\Controller;

use App\Repository\FeatureRepository;
use App\Repository\MainRepository;
use App\Repository\MissionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;

class HeroController extends AbstractController
{
    private FeatureRepository $featureRepository;
    private MainRepository $mainRepository;
    private MissionRepository $missionRepository;
    public function __construct(MainRepository $mainRepository, MissionRepository $missionRepository, FeatureRepository $featureRepository)
    {
        $this->mainRepository = $mainRepository;
        $this->missionRepository = $missionRepository;
        $this->featureRepository = $featureRepository;
    }
    #[Route('/main', name: 'hero')]
    public function main( #[MapQueryParameter] ?string $lang): JsonResponse
    {
        $lang = $lang ?? 'en';
        $result = $this->mainRepository->getMainData($lang);
        $result = $result[count($result) - 1];
        $response = [
            'title' => $result['translationTitle'] ?? $result['mainTitle'],
            'subtitle' => $result['translationSubtitle'] ?? $result['mainSubtitle'],
            'description' => $result['translationDescription'] ?? $result['mainDescription']
        ];
        return $this->json($response);
    }

    #[Route('/mission', name: 'mission')]
    public function mission( #[MapQueryParameter] ?string $lang): JsonResponse
    {
        $lang = $lang ?? 'en';
        $result = $this->missionRepository->getMissionData($lang);
        $result = $result[count($result) - 1];
        $response = [
            'title' => $result['translationTitle'] ?? $result['mainTitle'],
            'subtitle' => $result['translationSubtitle'] ?? $result['mainSubtitle'],
            'description' => $result['translationDescription'] ?? $result['mainDescription']
        ];
        return $this->json($response);
    }

    #[Route('/features', name: 'features')]
    public function features( #[MapQueryParameter] ?string $lang): JsonResponse
    {
        $lang = $lang ?? 'en';
        $result = $this->featureRepository->getFeatures($lang);
        $response = ['features' => []];
        foreach ($result as $item) {
            if (!isset($response['title'])) {
                $response['title'] = $item['translationTitle'] ?? $item['mainTitle'];

            }
            if (!isset($response['subtitle'])) {
                $response['subtitle'] = $item['translationSubtitle'] ?? $item['mainSubtitle'];
            }
            $response['features'][] = [
                'title' => $item['featureTranslationTitle'] ?? $item['featureTitle'],
                'subtitle' => $item['featureTranslationSubtitle'] ?? $item['featureSubtitle']
            ];

        }
        return $this->json($response);
    }
}