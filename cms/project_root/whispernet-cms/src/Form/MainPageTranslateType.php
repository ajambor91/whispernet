<?php

namespace App\Form;

use App\Entity\MainTranslate;
use App\Enum\Lang;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MainPageTranslateType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Title',
            ])
            ->add('subtitle', TextType::class, [
                'label' => 'Subtitle',
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'required' => false,
            ])
            ->add('code', ChoiceType::class, [
                'choices' => Lang::cases(),
                'choice_label' => fn (Lang $choice) => match ($choice) {
                    Lang::EN => Lang::EN->value,
                    Lang::PL => Lang::PL->value,
                },
            'choice_value' => fn (?Lang $choice) => $choice?->value
    ]);

    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => MainTranslate::class,
        ]);
    }
}