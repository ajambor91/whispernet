<?php
namespace App\Controller\Dashboard;
 use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
 use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
 use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
 use Symfony\Component\HttpFoundation\Response;
 use Symfony\Component\Routing\Attribute\Route;

 #[Route('/dashboard')]
 class DashboardController extends AbstractController
 {


     #[Route('/', name: 'dashboard_main')]
    public function dashboard(): Response
     {
        return $this->render('general.html.twig');
     }


 }