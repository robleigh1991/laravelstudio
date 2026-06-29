@props([
    'copyright' => null,
    'links' => [],
])

{{-- Responsive-by-default: stacked on mobile, row with space-between on md+. --}}
<footer {{ $attributes->merge(['class' => 'w-full border-t border-gray-200 px-6 py-8']) }}>
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 md:flex-row md:justify-between">
        <p class="text-sm text-gray-500">
            {{ $copyright ?? '© '.date('Y') }}
        </p>

        @if (! empty($links))
            <nav class="flex flex-wrap items-center justify-center gap-4">
                @foreach ($links as $link)
                    <a href="{{ $link['href'] ?? '#' }}" class="text-sm text-gray-500 transition hover:text-gray-900">
                        {{ $link['label'] ?? '' }}
                    </a>
                @endforeach
            </nav>
        @endif
    </div>
</footer>
