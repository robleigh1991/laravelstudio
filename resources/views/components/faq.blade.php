@props([
    'heading' => null,
    'items' => [],
])

{{-- Responsive-by-default: single readable column; spacing scales at md. --}}
<section {{ $attributes->merge(['class' => 'w-full px-6 py-16 md:py-24']) }}>
    <div class="mx-auto max-w-3xl">
        @if ($heading)
            <h2 class="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl">{{ $heading }}</h2>
        @endif

        <div class="divide-y divide-gray-200">
            @foreach ($items as $item)
                <div class="py-4">
                    <h3 class="font-medium text-gray-900">{{ $item['question'] ?? '' }}</h3>
                    <p class="mt-1 text-sm text-gray-600 md:text-base">{{ $item['answer'] ?? '' }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
