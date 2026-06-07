def poster_url(poster_path: str) -> str:
    if not poster_path:
        return ""
    if poster_path.startswith("http"):
        return poster_path
    return f"https://image.tmdb.org/t/p/w500{poster_path}"
