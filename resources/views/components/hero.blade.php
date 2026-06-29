@props([
    'headline' => 'Headline',
    'subheadline' => null,
    'ctaLabel' => null,
    'ctaHref' => '#',
])

{{-- Responsive-by-default: centered, fluid type, generous spacing that scales up at md/lg. --}}
<section {{ $attributes->merge(['class' => 'w-full px-6 py-16 md:py-24 lg:py-32 text-center']) }}>
    <div class="mx-auto max-w-3xl">
        <h1 class="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {{ $headline }}
        </h1>

        @if ($subheadline)
            <p class="mt-4 text-base text-gray-600 md:mt-6 md:text-lg lg:text-xl">
                {{ $subheadline }}
            </p>
        @endif

        @if ($ctaLabel)
            <div class="mt-8">
                <a href="{{ $ctaHref }}"
                   class="inline-flex items-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 md:text-base">
                    {{ $ctaLabel }}
                </a>
            </div>
        @endif
    </div>
</section>
