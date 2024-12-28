<?php
namespace App\Controller;

use App\Repository\MainRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;

class HeroController extends AbstractController
{
    private MainRepository $mainRepository;
    public function __construct(MainRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }
    #[Route('/', name: 'hero')]
    public function main( #[MapQueryParameter] string $lang): JsonResponse
    {
        $result = $this->mainRepository->getMainData($lang);
        $result = $result[count($result) - 1];
        $response = [
            'title' => $result['translationTitle'] ?? $result['mainTitle'],
            'subtitle' => $result['translationSubtitle'] ?? $result['mainSubtitle'],
            'description' => $result['translationDescription'] ?? $result['mainDescription']
        ];
        return $this->json($response);
    }
}