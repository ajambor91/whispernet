<?php

namespace App\Entity;

use App\Enum\Lang;
use App\Repository\PointTranslateRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PointTranslateRepository::class)]
class PointTranslate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 1024)]
    private ?string $subtitle = null;

    #[ORM\Column(enumType: Lang::class)]
    private ?Lang $code = null;

    #[ORM\ManyToOne(inversedBy: 'translate')]
    private ?Point $point = null;

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

    public function getCode(): ?Lang
    {
        return $this->code;
    }

    public function setCode(Lang $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getPoint(): ?Point
    {
        return $this->point;
    }

    public function setPoint(?Point $point): static
    {
        $this->point = $point;

        return $this;
    }
}
