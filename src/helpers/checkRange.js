export const checkRange = (from, to, setHelper) => {
    const dateFrom = new Date(from)
    const dateTo = new Date(to)
    if (dateFrom instanceof Date && dateTo instanceof Date) {
        if (dateTo < dateFrom) {
            setHelper("Invalid Range - Showing All Data")

            return false
        } else if (dateTo >= dateFrom) {
            setHelper("Range Valid - Showing Filtered Data")

            return true
        } else {
            setHelper("Invalid Range- Showing All Data")

            return false
        }

    } else {
        setHelper("Invalid Date")

        return false
    }
}