<?php
namespace App\Service;
use App\Entity\Feature;
use App\Entity\FeatureTranslate;
use App\Entity\Point;
use App\Entity\PointTranslate;
use App\Enum\Lang;
use App\Repository\FeatureRepository;
use Doctrine\ORM\EntityManagerInterface;

class FeatureService
{

    private FeatureRepository $featureRepository;
    private EntityManagerInterface $entityManager;
    public function __construct(FeatureRepository $featureRepository, EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->featureRepository = $featureRepository;
    }
    public function setFeature(array $data): Feature {
        $reqFeature = $data['feature'];
        $feature = null;
        $existingFeature = $this->featureRepository->findAll();
        if (count($existingFeature) > 0 ) {
            $feature = $existingFeature[count($existingFeature) - 1];
        } else {
            $feature = new Feature();
        }

        $feature->setTitle($reqFeature['title'])
               ->setSubtitle($reqFeature['subtitle']);
       foreach ($feature->getFeatures() as $featureToDel) {
           $feature->removeFeature($featureToDel);
       }
       if (isset($reqFeature['translate'])) {
           foreach ($reqFeature['translate'] as $featureTranslate) {
               $foundTranslation = null;
               foreach ($feature->getTranslate() as $existingTranslation) {
                   if ($existingTranslation->getCode()->value === $featureTranslate['code']) {
                       $foundTranslation = $existingTranslation;
                       break;
                   }
               }
               if ($foundTranslation != null ) {
                   $foundTranslation->setTitle($featureTranslate['title'])
                       ->setSubtitle($featureTranslate['subtitle'])
                       ->setFeature($feature);
               } else {
                   $newTranslation = new FeatureTranslate();
                   $newTranslation->setCode(Lang::from($featureTranslate['code']))
                       ->setSubtitle($featureTranslate['subtitle'])
                       ->setTitle($featureTranslate['title'])
                       ->setFeature($feature);
                   $feature->addTranslate($newTranslation);
               }
           }
       }

       if (isset($reqFeature['features'])) {
           foreach ($reqFeature['features'] as $featurePoint) {
               $point = new Point();
               $point->setTitle($featurePoint['title'])
                   ->setSubtitle($featurePoint['subtitle']);
               if (isset($featurePoint['translate'])) {
                   foreach ($featurePoint['translate'] as $featureTranslation) {
                       $pointTranslation = new PointTranslate();
                       $pointTranslation->setTitle($featureTranslation['title'])
                           ->setCode(Lang::from($featureTranslation['code']))
                           ->setSubtitle($featureTranslation['subtitle'])
                           ->setPoint($point);
                       $point->addTranslate($pointTranslation);
                   }
               }
               $feature->addFeature($point);
           }
       }


        $this->entityManager->persist($feature);
        $this->entityManager->flush();
        return $feature;
    }
}