<?php

namespace App\Repository;

use App\Entity\Feature;
use App\Enum\Lang;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Feature>
 */
class FeatureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Feature::class);
    }

    public function getFeatures(string $lang = Lang::EN->value): array
    {
        $qb = $this->createQueryBuilder('q');
        $qb->distinct(true)
            ->select('q.title as mainTitle, q.subtitle as mainSubtitle,  ft.title as translationTitle, ft.subtitle as translationSubtitle, ptf.title as featureTitle, ptf.subtitle as featureSubtitle, ptfTrans.title as featureTranslationTitle, ptfTrans.subtitle as featureTranslationSubtitle ')
            ->leftJoin('q.translate', 'ft', 'WITH', 'ft.code = :code')
            ->leftJoin('q.features', 'ptf')
            ->leftJoin('ptf.translate', 'ptfTrans', 'WITH', 'ptfTrans.code = :code')
            ->setParameter('code', $lang);
        return $qb->getQuery()->getResult();
    }

    //    /**
    //     * @return Feature[] Returns an array of Feature objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Feature
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
