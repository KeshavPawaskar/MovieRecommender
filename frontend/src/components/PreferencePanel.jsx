import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Typography
} from "@mui/material";

const runtimeOptions = [
  { value: "any", label: "Any length" },
  { value: "short", label: "Under 2 hours" },
  { value: "long", label: "Long movies okay" }
];

const ratingOptions = [7, 7.5, 8];

function ToggleGroup({ label, values, selectedValues, onChange }) {
  function handleToggle(value) {
    const next = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    onChange(next);
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend" sx={{ mb: 1, fontSize: "0.82rem", fontWeight: 900, textTransform: "uppercase" }}>
          {label}
        </FormLabel>
        <FormGroup row sx={{ gap: 1 }}>
          {values.map((value) => (
            <FormControlLabel
              key={value}
              control={<Checkbox checked={selectedValues.includes(value)} onChange={() => handleToggle(value)} size="small" />}
              label={value}
              sx={{
                m: 0,
                px: 1.25,
                minHeight: 36,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 999,
                bgcolor: "#f4f2eb"
              }}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Paper>
  );
}

export function PreferencePanel({ options, preferences, onPreferenceChange }) {
  const countries = options?.countries || [];
  const platforms = options?.platforms || [];
  const genres = options?.genres || [];
  const countryValue = countries.some((country) => country.code === preferences.country) ? preferences.country : "";

  function update(key, value) {
    onPreferenceChange({ ...preferences, [key]: value });
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" }, gap: 2, mt: 2.25, mb: 4.25 }}>
      <Box>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="country-label">Country</InputLabel>
            <Select labelId="country-label" label="Country" value={countryValue} onChange={(event) => update("country", event.target.value)}>
              {countries.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>

      <Box>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="rating-label">Minimum rating</InputLabel>
            <Select
              labelId="rating-label"
              label="Minimum rating"
              value={preferences.minimumRating}
              onChange={(event) => update("minimumRating", Number(event.target.value))}
            >
              {ratingOptions.map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating.toFixed(1)}+
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>

      <Box>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="runtime-label">Runtime</InputLabel>
            <Select labelId="runtime-label" label="Runtime" value={preferences.runtime} onChange={(event) => update("runtime", event.target.value)}>
              {runtimeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>

      <Box>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ mb: 1, color: "text.secondary", fontSize: "0.82rem", fontWeight: 900, textTransform: "uppercase" }}>
            Discovery mode
          </Typography>
          <Slider value={preferences.surprise} onChange={(_, value) => update("surprise", value)} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Safe
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Surprise
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ gridColumn: { xs: "auto", md: "span 2" } }}>
        <ToggleGroup label="Platforms" values={platforms} selectedValues={preferences.platforms} onChange={(value) => update("platforms", value)} />
      </Box>

      <Box sx={{ gridColumn: { xs: "auto", md: "span 2" } }}>
        <ToggleGroup label="Genres" values={genres} selectedValues={preferences.genres} onChange={(value) => update("genres", value)} />
      </Box>
    </Box>
  );
}
