export const loadTours = async (locations = []) => {
  const tours = []
  for (const l of locations) {
    if (l.split('.').pop() === 'json') {
      try {
        const response = await fetch(l)
        if (response.ok) {
          const tour = await response.json()
          tours.push(tour)
        }
      } catch (e) {
        console.error(`Failed to load tours '${l}' is not a valid json file.`)
      }
    }
  }
  return { tours: tours }
}

export function autostartTours(tours, location) {
  const autostartTours = tours.filter((t) => t.autostart?.location === location)
  if (autostartTours.length) {
    const t = autostartTours[0]
    setTimeout(() => {
      if (
        !(localStorage.getItem('tours/' + t.options.tourName) && location === t.autostart.location)
      ) {
        t.start()
        localStorage.setItem('tours/' + t.options.tourName, Date.now())
      }
    }, t.autostart.timeout)
  }
  return 'autostart1'
}
