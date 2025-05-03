<?php

namespace App\Repository;

use App\Entity\Mission;
use App\Enum\Lang;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Mission>
 */
class MissionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Mission::class);
    }

    public function getMissionData(string $lang = Lang::EN->value): array
    {
        $qb = $this->createQueryBuilder('q')
            ->select("q.title as mainTitle, q.subtitle as mainSubtitle, q.description as mainDescription, t.title as translationTitle, t.subtitle as translationSubtitle, t.description as translationDescription")
            ->leftJoin('q.translation', 't' , 'WITH', 't.code = :code')
            ->setParameter('code', $lang);
        return $qb->getQuery()->getResult();
    }
    //    /**
    //     * @return Mission[] Returns an array of Mission objects
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

    //    public function findOneBySomeField($value): ?Mission
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
