<?php

namespace App\Entity;

use App\Repository\PointRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PointRepository::class)]
class Point
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 1024)]
    private ?string $subtitle = null;

    /**
     * @var Collection<int, PointTranslate>
     */
    #[ORM\OneToMany(targetEntity: PointTranslate::class, mappedBy: 'point',  cascade: ['persist'])]
    private Collection $translate;

    #[ORM\ManyToOne(inversedBy: 'features')]
    private ?Feature $feature = null;

    public function __construct()
    {
        $this->translate = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getSubtitle(): ?string
    {
        return $this->subtitle;
    }

    public function setSubtitle(string $subtitle): static
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    /**
     * @return Collection<int, PointTranslate>
     */
    public function getTranslate(): Collection
    {
        return $this->translate;
    }

    public function addTranslate(PointTranslate $translate): static
    {
        if (!$this->translate->contains($translate)) {
            $this->translate->add($translate);
            $translate->setPoint($this);
        }

        return $this;
    }

    public function removeTranslate(PointTranslate $translate): static
    {
        if ($this->translate->removeElement($translate)) {
            // set the owning side to null (unless already changed)
            if ($translate->getPoint() === $this) {
                $translate->setPoint(null);
            }
        }

        return $this;
    }

    public function getFeature(): ?Feature
    {
        return $this->feature;
    }

    public function setFeature(?Feature $feature): static
    {
        $this->feature = $feature;

        return $this;
    }
}
