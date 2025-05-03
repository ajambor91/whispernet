<?php

namespace App\Entity;

use App\Repository\MissionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MissionRepository::class)]
class Mission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    private ?string $subtitle = null;

    #[ORM\Column(length: 1024)]
    private ?string $description = null;

    /**
     * @var Collection<int, MissionTranslation>
     */
    #[ORM\OneToMany(targetEntity: MissionTranslation::class, mappedBy: 'mission', cascade: ['PERSIST'])]
    private Collection $translation;

    public function __construct()
    {
        $this->translation = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, MissionTranslation>
     */
    public function getTranslation(): Collection
    {
        return $this->translation;
    }

    public function addTranslation(MissionTranslation $translation): static
    {
        if (!$this->translation->contains($translation)) {
            $this->translation->add($translation);
            $translation->setMission($this);
        }

        return $this;
    }

    public function removeTranslation(MissionTranslation $translation): static
    {
        if ($this->translation->removeElement($translation)) {
            // set the owning side to null (unless already changed)
            if ($translation->getMission() === $this) {
                $translation->setMission(null);
            }
        }

        return $this;
    }
}
