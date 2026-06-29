@props([
    'heading' => null,
    'items' => [],
])

{{-- Responsive-by-default: 1 column on mobile, 2 on tablet, 3 on desktop. --}}
<section {{ $attributes->merge(['class' => 'w-full px-6 py-16 md:py-24']) }}>
    <div class="mx-auto max-w-6xl">
        @if ($heading)
            <h2 class="mb-10 text-center text-2xl font-bold md:mb-14 md:text-4xl">
                {{ $heading }}
            </h2>
        @endif

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            @foreach ($items as $item)
                <div class="rounded-xl border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold md:text-xl">{{ $item['title'] ?? '' }}</h3>
                    <p class="mt-2 text-sm text-gray-600 md:text-base">{{ $item['body'] ?? '' }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>
