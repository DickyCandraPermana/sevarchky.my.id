import re
import pytest

try:
    from lib.performance import (
        FRESNEL_PALETTES,
        getPaletteByKey,
        resolvePerformanceTier,
    )
except ImportError:
    try:
        from lib.performance import (
            FRESNEL_PALETTES,
            get_palette_by_key as getPaletteByKey,
            resolve_performance_tier as resolvePerformanceTier,
        )
    except ImportError:
        try:
            from performance import (
                FRESNEL_PALETTES,
                getPaletteByKey,
                resolvePerformanceTier,
            )
        except ImportError:
            from performance import (
                FRESNEL_PALETTES,
                get_palette_by_key as getPaletteByKey,
                resolve_performance_tier as resolvePerformanceTier,
            )


class DeviceAttrs(dict):
    """Dictionary subclass supporting both attribute and dict-item access for device attributes."""

    def __init__(self, is_mobile=False, screen_width=1024, device_pixel_ratio=1.0, **kwargs):
        payload = {
            "isMobile": is_mobile,
            "is_mobile": is_mobile,
            "screenWidth": screen_width,
            "screen_width": screen_width,
            "devicePixelRatio": device_pixel_ratio,
            "device_pixel_ratio": device_pixel_ratio,
            **kwargs,
        }
        super().__init__(payload)
        self.__dict__.update(payload)


def get_prop(obj, *keys):
    """Helper to retrieve properties whether the object is a dict or a class instance."""
    for key in keys:
        if isinstance(obj, dict) and key in obj:
            return obj[key]
        if hasattr(obj, key):
            return getattr(obj, key)
    raise KeyError(f"None of {keys} found in {obj}")


# ============================================================================
# Fresnel Palette Invariant Tests
# ============================================================================

class TestFresnelPalettesInvariants:
    HEX_COLOR_PATTERN = re.compile(r"^#[0-9A-Fa-f]{6}$")

    def test_palette_count_and_structure(self):
        """Palette list must contain exactly 4 presets with expected fields."""
        assert len(FRESNEL_PALETTES) == 4

        for item in FRESNEL_PALETTES:
            name = get_prop(item, "name")
            key = get_prop(item, "key")
            hex_val = get_prop(item, "hex")
            secondary_hex = get_prop(item, "secondaryHex", "secondary_hex")

            assert isinstance(name, str) and len(name.strip()) > 0
            assert isinstance(key, str) and len(key.strip()) > 0
            assert isinstance(hex_val, str)
            assert isinstance(secondary_hex, str)

    def test_palette_hex_format(self):
        """Every primary and secondary hex must be valid 6-character hex color codes."""
        for item in FRESNEL_PALETTES:
            hex_val = get_prop(item, "hex")
            secondary_hex = get_prop(item, "secondaryHex", "secondary_hex")

            assert self.HEX_COLOR_PATTERN.match(hex_val) is not None, f"Invalid hex: {hex_val}"
            assert (
                self.HEX_COLOR_PATTERN.match(secondary_hex) is not None
            ), f"Invalid secondary hex: {secondary_hex}"

    def test_palette_keys_and_names_are_unique(self):
        """All palette keys and names must be unique and keys must be lowercase."""
        keys = [get_prop(item, "key") for item in FRESNEL_PALETTES]
        names = [get_prop(item, "name") for item in FRESNEL_PALETTES]

        assert len(keys) == len(set(keys)), "Palette keys must be unique"
        assert len(names) == len(set(names)), "Palette names must be unique"

        for k in keys:
            assert k == k.lower(), f"Key '{k}' must be lowercase"

    def test_first_palette_is_default_anchor(self):
        """First entry should be Lavender Moonstone used as the fallback."""
        first = FRESNEL_PALETTES[0]
        assert get_prop(first, "key") == "lavender"
        assert get_prop(first, "name") == "Lavender Moonstone"
        assert get_prop(first, "hex").upper() == "#D8B4FE"
        assert get_prop(first, "secondaryHex", "secondary_hex").upper() == "#818CF8"


# ============================================================================
# getPaletteByKey Tests
# ============================================================================

class TestGetPaletteByKey:
    @pytest.mark.parametrize(
        "key, expected_key, expected_name",
        [
            ("lavender", "lavender", "Lavender Moonstone"),
            ("mint", "mint", "Iridescent Mint"),
            ("champagne", "champagne", "Champagne Peach"),
            ("rose", "rose", "Ethereal Rose"),
        ],
    )
    def test_exact_key_lookup(self, key, expected_key, expected_name):
        palette = getPaletteByKey(key)
        assert get_prop(palette, "key") == expected_key
        assert get_prop(palette, "name") == expected_name

    @pytest.mark.parametrize(
        "query, expected_key",
        [
            ("  LAVENDER  ", "lavender"),
            ("MINT\n", "mint"),
            ("  Champagne  ", "champagne"),
            ("ROSE", "rose"),
        ],
    )
    def test_case_insensitivity_and_whitespace_trimming(self, query, expected_key):
        palette = getPaletteByKey(query)
        assert get_prop(palette, "key") == expected_key

    @pytest.mark.parametrize(
        "partial_name, expected_key",
        [
            ("Moonstone", "lavender"),
            ("iridescent", "mint"),
            ("PEACH", "champagne"),
            ("ethereal", "rose"),
        ],
    )
    def test_lookup_by_name_substring(self, partial_name, expected_key):
        palette = getPaletteByKey(partial_name)
        assert get_prop(palette, "key") == expected_key

    @pytest.mark.parametrize(
        "invalid_key",
        [
            "unknown",
            "nonexistent",
            "",
            "   ",
            "emerald",
            "12345",
        ],
    )
    def test_fallback_to_default_palette_on_missing_key(self, invalid_key):
        palette = getPaletteByKey(invalid_key)
        default_palette = FRESNEL_PALETTES[0]
        assert get_prop(palette, "key") == get_prop(default_palette, "key")
        assert get_prop(palette, "name") == get_prop(default_palette, "name")


# ============================================================================
# resolvePerformanceTier Tests
# ============================================================================

class TestResolvePerformanceTier:
    @pytest.mark.parametrize(
        "width, is_mobile, dpr",
        [
            (320, True, 2.0),
            (375, True, 3.0),
            (414, False, 2.0),
            (767, False, 1.0),
            (1920, True, 2.0),  # Mobile flag takes precedence even on large screen
            (0, False, 1.0),
        ],
    )
    def test_mobile_tier_resolution(self, width, is_mobile, dpr):
        attrs = DeviceAttrs(is_mobile=is_mobile, screen_width=width, device_pixel_ratio=dpr)
        tier = resolvePerformanceTier(attrs)

        assert get_prop(tier, "tier") == 1
        assert get_prop(tier, "name") == "Mobile Organic Tier"
        assert get_prop(tier, "particleCount", "particle_count") == 8000
        assert get_prop(tier, "monolithSubdivisions", "monolith_subdivisions") == 32
        assert get_prop(tier, "maxDpr", "max_dpr") == 1.0
        assert get_prop(tier, "enableBloom", "enable_bloom") is False

    @pytest.mark.parametrize(
        "width, dpr",
        [
            (768, 1.0),   # Lower boundary of tablet tier
            (769, 2.0),
            (1024, 2.0),  # Standard tablet
            (1279, 1.5),  # Upper boundary of tablet tier
        ],
    )
    def test_tablet_tier_resolution(self, width, dpr):
        attrs = DeviceAttrs(is_mobile=False, screen_width=width, device_pixel_ratio=dpr)
        tier = resolvePerformanceTier(attrs)

        assert get_prop(tier, "tier") == 2
        assert get_prop(tier, "name") == "Tablet Dreamscape Tier"
        assert get_prop(tier, "particleCount", "particle_count") == 12000
        assert get_prop(tier, "monolithSubdivisions", "monolith_subdivisions") == 48
        assert get_prop(tier, "maxDpr", "max_dpr") == 1.25
        assert get_prop(tier, "enableBloom", "enable_bloom") is True

    @pytest.mark.parametrize(
        "width, dpr",
        [
            (1280, 1.0),  # Boundary of desktop tier
            (1440, 2.0),
            (1920, 1.0),  # Standard 1080p
            (2560, 2.0),  # 1440p
            (3840, 2.0),  # 4K
        ],
    )
    def test_desktop_tier_resolution(self, width, dpr):
        attrs = DeviceAttrs(is_mobile=False, screen_width=width, device_pixel_ratio=dpr)
        tier = resolvePerformanceTier(attrs)

        assert get_prop(tier, "tier") == 3
        assert get_prop(tier, "name") == "Desktop Dreamscape Tier"
        assert get_prop(tier, "particleCount", "particle_count") == 16000
        assert get_prop(tier, "monolithSubdivisions", "monolith_subdivisions") == 64
        assert get_prop(tier, "maxDpr", "max_dpr") == 1.5
        assert get_prop(tier, "enableBloom", "enable_bloom") is True

    def test_exact_width_boundaries(self):
        """Test transitions at exact boundary pixels: 767 -> 768 and 1279 -> 1280."""
        mobile_border = resolvePerformanceTier(
            DeviceAttrs(is_mobile=False, screen_width=767, device_pixel_ratio=1.0)
        )
        assert get_prop(mobile_border, "tier") == 1

        tablet_lower_border = resolvePerformanceTier(
            DeviceAttrs(is_mobile=False, screen_width=768, device_pixel_ratio=1.0)
        )
        assert get_prop(tablet_lower_border, "tier") == 2

        tablet_upper_border = resolvePerformanceTier(
            DeviceAttrs(is_mobile=False, screen_width=1279, device_pixel_ratio=1.0)
        )
        assert get_prop(tablet_upper_border, "tier") == 2

        desktop_border = resolvePerformanceTier(
            DeviceAttrs(is_mobile=False, screen_width=1280, device_pixel_ratio=1.0)
        )
        assert get_prop(desktop_border, "tier") == 3

    def test_device_pixel_ratio_does_not_affect_tier_selection(self):
        """Different DPR values should not distort the selected tier category."""
        low_dpr_desktop = resolvePerformanceTier(
            DeviceAttrs(is_mobile=False, screen_width=1920, device_pixel_ratio=0.5)
        )
        high_dpr_desktop = resolvePerformanceTier(
            DeviceAttrs(is_mobile=False, screen_width=1920, device_pixel_ratio=4.0)
        )

        assert get_prop(low_dpr_desktop, "tier") == 3
        assert get_prop(high_dpr_desktop, "tier") == 3
        assert (
            get_prop(low_dpr_desktop, "particleCount", "particle_count")
            == get_prop(high_dpr_desktop, "particleCount", "particle_count")
        )
