<?php

namespace App\Repository;

use App\Entity\Main;
use App\Entity\MainTranslate;
use App\Enum\Lang;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Main>
 */
class MainRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Main::class);
    }

    public function getMainData(string $lang = Lang::EN->value): array
    {
        $qb = $this->createQueryBuilder('q')
            ->select("q.title as mainTitle, q.subtitle as mainSubtitle, q.description as mainDescription, t.title as translationTitle, t.subtitle as translationSubtitle, t.description as translationDescription")
            ->leftJoin('q.translate', 't' )
            ->where('t.code = :code')
            ->setParameter('code', $lang);
        return $qb->getQuery()->getResult();
    }

    //    /**
    //     * @return Main[] Returns an array of Main objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Main
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
