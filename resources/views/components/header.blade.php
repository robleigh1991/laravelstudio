@props([
    'brand' => 'Brand',
    'links' => [],
])

{{-- Responsive-by-default: brand always visible; nav collapses on mobile. --}}
<header {{ $attributes->merge(['class' => 'w-full border-b border-gray-200 px-6 py-4']) }}>
    <div class="mx-auto flex max-w-6xl items-center justify-between">
        <span class="text-lg font-semibold">{{ $brand }}</span>
        <nav class="hidden items-center gap-6 md:flex">
            @foreach ($links as $link)
                <a href="{{ $link['href'] ?? '#' }}" class="text-sm text-gray-600 transition hover:text-gray-900">
                    {{ $link['label'] ?? '' }}
                </a>
            @endforeach
        </nav>
    </div>
</header>
