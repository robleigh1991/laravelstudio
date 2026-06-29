@props([
    'heading' => 'Ready to start?',
    'subheading' => null,
    'buttonLabel' => null,
    'buttonHref' => '#',
])

{{-- Responsive-by-default: centered band, spacing scales up at md. --}}
<section {{ $attributes->merge(['class' => 'w-full px-6 py-16 text-center md:py-24']) }}>
    <div class="mx-auto max-w-2xl">
        <h2 class="text-2xl font-bold md:text-3xl">{{ $heading }}</h2>

        @if ($subheading)
            <p class="mt-3 text-base text-gray-600 md:text-lg">{{ $subheading }}</p>
        @endif

        @if ($buttonLabel)
            <div class="mt-6">
                <a href="{{ $buttonHref }}"
                   class="inline-flex items-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 md:text-base">
                    {{ $buttonLabel }}
                </a>
            </div>
        @endif
    </div>
</section>
