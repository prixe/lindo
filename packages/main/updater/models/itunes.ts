export interface ItunesLookup {
  resultCount: number
  results: LookUpResult[]
}

export interface LookUpResult {
  appletvScreenshotUrls: unknown[]
  screenshotUrls: string[]
  ipadScreenshotUrls: string[]
  artworkUrl60: string
  artworkUrl512: string
  artworkUrl100: string
  artistViewUrl: string
  features: string[]
  supportedDevices: string[]
  advisories: string[]
  isGameCenterEnabled: boolean
  kind: string
  minimumOsVersion: string
  trackCensoredName: string
  languageCodesISO2A: string[]
  fileSizeBytes: string
  sellerUrl: string
  formattedPrice: string
  contentAdvisoryRating: string
  averageUserRatingForCurrentVersion: number
  userRatingCountForCurrentVersion: number
  averageUserRating: number
  trackViewUrl: string
  trackContentRating: string
  bundleId: string
  currency: string
  trackId: number
  trackName: string
  isVppDeviceBasedLicensingEnabled: boolean
  genreIds: string[]
  primaryGenreName: string
  releaseDate: Date
  sellerName: string
  currentVersionReleaseDate: Date
  releaseNotes: string
  primaryGenreId: number
  version: string
  wrapperType: string
  artistId: number
  artistName: string
  genres: string[]
  price: number
  description: string
  userRatingCount: number
}
