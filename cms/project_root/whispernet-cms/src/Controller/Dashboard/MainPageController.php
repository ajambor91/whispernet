<?php

namespace App\Controller\Dashboard;

use App\Entity\Main;
use App\Form\MainPageType;
use App\Repository\MainRepository;
use App\Service\MainPageService;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use phpDocumentor\Reflection\Types\This;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/dashboard/main')]
class MainPageController extends AbstractController
{

    private MainRepository $mainRepository;
    private MainPageService $mainPageService;
    public function __construct(MainRepository $mainRepository, MainPageService $mainPageService)
    {
        $this->mainRepository = $mainRepository;
        $this->mainPageService =$mainPageService;
    }
    #[Route('/', name: 'main_page', methods: ["GET", "POST"])]
    public function mainPageDashboard(Request $request): Response
    {
        $main = null;
        if ($request->getMethod() === 'POST'){
            $main = $this->mainPageService->setMainPage($request->request->all());
        } else {
            $main = $this->mainRepository->findAll();
            $main = $main ? $main[count($main) - 1] : new Main();
        }
        $form = $this->createForm(MainPageType::class, $main);
        return $this->render('main_page.html.twig', ['form' => $form->createView(), 'helpers' => 'created']);
    }
}