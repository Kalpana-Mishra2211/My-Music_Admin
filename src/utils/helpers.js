export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

   export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  export const recentTime = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) {
    return `${seconds} sec ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} day ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} month ago`;
  }

  const years = Math.floor(months / 12);

  return `${years} year ago`;
};

  export  const calculateTotalDuration = (musics) => {
    if (!musics || musics.length === 0) return "0:00";
    const totalSeconds = musics.reduce((sum, music) => sum + (music.duration || 0), 0);
    return formatTime(totalSeconds);
  };

  export const searchFilter = (
  data = [],
  search = "",
  fields = []
) => {

  if (!search?.trim()) return data;

  return data.filter((item) =>
    fields.some((field) => {

      const value = field
        .split(".")
        .reduce((obj, key) => obj?.[key], item);

      return value
        ?.toString()
        .toLowerCase()
        .includes(search.toLowerCase());
    })
  );
};

export const searchAndFilter = (
  data = [],
  search = "",
  fields = [],
  filters = {}
) => {
  return data.filter((item) => {
    const matchSearch =
      !search?.trim() ||
      fields.some((field) => {
        const value = field
          .split(".")
          .reduce((obj, key) => obj?.[key], item);

        return value
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase());
      });

    const matchFilters = Object.entries(filters).every(
      ([key, filterValue]) => {
        if (!filterValue || filterValue === "all") return true;

        const itemValue = key.split(".")
          .reduce((obj, k) => obj?.[k], item);
        return (
          itemValue?.toString().toLowerCase() ===
          filterValue.toString().toLowerCase()
        );
      }
    );

    return matchSearch && matchFilters;
  });
};
