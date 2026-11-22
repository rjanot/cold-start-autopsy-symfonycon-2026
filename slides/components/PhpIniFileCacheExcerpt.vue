<script setup lang="ts">
defineProps<{ highlight: number[] }>()

// Verbatim from php/php-src at tag php-8.5.12, php.ini-production, lines 1784-1791.
const code = `; Enables or disables read-only mode for the second level cache directory.
; It should improve performance for read-only containers,
; when the cache is pre-warmed and packaged alongside the application.
; Best used with \`opcache.validate_timestamps=0\`, \`opcache.enable_file_override=1\`
; and \`opcache.file_cache_consistency_checks=0\`.
; Note: A cache generated with a different build of PHP, a different file path,
; or different settings (including which extensions are loaded), may be ignored.
;opcache.file_cache_read_only=0`
</script>

<template>
  <CodePanel
    file="php.ini-production"
    version="PHP 8.5.12"
    :first-line="1784"
    :code="code"
    :highlight="highlight"
  />
</template>
