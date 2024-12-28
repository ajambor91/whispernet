<?php

namespace App\Entity;

use App\Enum\Lang;
use App\Repository\MainTranslateRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MainTranslateRepository::class)]
class MainTranslate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    private ?string $subtitle = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(enumType: Lang::class)]
    private ?Lang $code = null;

    #[ORM\ManyToOne(inversedBy: 'translate')]
    private ?Main $main = null;

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

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCode(): ?Lang
    {
        return $this->code;
    }

    public function setCode(Lang $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getMain(): ?Main
    {
        return $this->main;
    }

    public function setMain(?Main $main): static
    {
        $this->main = $main;

        return $this;
    }
}
