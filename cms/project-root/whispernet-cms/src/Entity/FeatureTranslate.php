<?php

namespace App\Entity;

use App\Enum\Lang;
use App\Repository\FeatureTranslateRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FeatureTranslateRepository::class)]
class FeatureTranslate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 1024)]
    private ?string $subtitle = null;

    #[ORM\ManyToOne(inversedBy: 'translate')]
    private ?Feature $feature = null;

    #[ORM\Column(enumType: Lang::class)]
    private ?Lang $code = null;

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

    public function getFeature(): ?Feature
    {
        return $this->feature;
    }

    public function setFeature(?Feature $feature): static
    {
        $this->feature = $feature;

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
}
