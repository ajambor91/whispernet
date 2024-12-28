<?php

namespace App\Entity;

use App\Repository\FeatureRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FeatureRepository::class)]
class Feature
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    private ?string $subtitle = null;

    /**
     * @var Collection<int, Point>
     */
    #[ORM\OneToMany(targetEntity: Point::class, mappedBy: 'feature')]
    private Collection $features;

    /**
     * @var Collection<int, FeatureTranslate>
     */
    #[ORM\OneToMany(targetEntity: FeatureTranslate::class, mappedBy: 'feature')]
    private Collection $translate;

    public function __construct()
    {
        $this->features = new ArrayCollection();
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
     * @return Collection<int, Point>
     */
    public function getFeatures(): Collection
    {
        return $this->features;
    }

    public function addFeature(Point $feature): static
    {
        if (!$this->features->contains($feature)) {
            $this->features->add($feature);
            $feature->setFeature($this);
        }

        return $this;
    }

    public function removeFeature(Point $feature): static
    {
        if ($this->features->removeElement($feature)) {
            // set the owning side to null (unless already changed)
            if ($feature->getFeature() === $this) {
                $feature->setFeature(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, FeatureTranslate>
     */
    public function getTranslate(): Collection
    {
        return $this->translate;
    }

    public function addTranslate(FeatureTranslate $translate): static
    {
        if (!$this->translate->contains($translate)) {
            $this->translate->add($translate);
            $translate->setFeature($this);
        }

        return $this;
    }

    public function removeTranslate(FeatureTranslate $translate): static
    {
        if ($this->translate->removeElement($translate)) {
            // set the owning side to null (unless already changed)
            if ($translate->getFeature() === $this) {
                $translate->setFeature(null);
            }
        }

        return $this;
    }
}
