<?php

namespace App\Entity;

use App\Repository\MainRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MainRepository::class)]
class Main
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    private ?string $subtitle = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    /**
     * @var Collection<int, MainTranslate>
     */
    #[ORM\OneToMany(targetEntity: MainTranslate::class, mappedBy: 'main', cascade: ['persist'])]
    private Collection $translate;

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
     * @return Collection<int, MainTranslate>
     */
    public function getTranslate(): Collection
    {
        return $this->translate;
    }

    public function addTranslate(MainTranslate $translate): static
    {
        if (!$this->translate->contains($translate)) {
            $this->translate->add($translate);
            $translate->setMain($this);
        }

        return $this;
    }

    public function removeTranslate(MainTranslate $translate): static
    {
        if ($this->translate->removeElement($translate)) {
            // set the owning side to null (unless already changed)
            if ($translate->getMain() === $this) {
                $translate->setMain(null);
            }
        }

        return $this;
    }
}
