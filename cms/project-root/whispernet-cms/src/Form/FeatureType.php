<?php

namespace App\Form;

use App\Entity\Feature;
use App\Entity\MainTranslate;
use App\Entity\PointTranslate;
use App\Enum\Lang;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FeatureType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Title',
                'attr' => [
                    'class' => 'form-control'
                ]
            ])
            ->add('subtitle', TextType::class, [
                'label' => 'Subtitle',
                'attr' => [
                    'class' => 'form-control'
                ]
            ])
            ->add('translate', CollectionType::class, [
                'entry_type' => FeatureTranslateType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'label' => false
            ])
            ->add('features', CollectionType::class, [
                'entry_type' => PointType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'label'=> false]);

    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Feature::class,
        ]);
    }
}