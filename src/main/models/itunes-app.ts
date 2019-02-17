export interface ItunesResponse {
  resultCount: number;
  results:     ItunesApp[];
}

export interface ItunesApp {
  isGameCenterEnabled:                boolean;
  screenshotUrls:                     string[];
  ipadScreenshotUrls:                 string[];
  appletvScreenshotUrls:              any[];
  artworkUrl60:                       string;
  artworkUrl512:                      string;
  artworkUrl100:                      string;
  artistViewUrl:                      string;
  supportedDevices:                   string[];
  kind:                               string;
  features:                           string[];
  advisories:                         string[];
  averageUserRatingForCurrentVersion: number;
  trackViewUrl:                       string;
  trackContentRating:                 string;
  fileSizeBytes:                      string;
  sellerUrl:                          string;
  userRatingCountForCurrentVersion:   number;
  trackCensoredName:                  string;
  languageCodesISO2A:                 string[];
  contentAdvisoryRating:              string;
  currentVersionReleaseDate:          Date;
  minimumOsVersion:                   string;
  sellerName:                         string;
  isVppDeviceBasedLicensingEnabled:   boolean;
  genreIds:                           string[];
  releaseDate:                        Date;
  primaryGenreName:                   string;
  primaryGenreId:                     number;
  releaseNotes:                       string;
  formattedPrice:                     string;
  currency:                           string;
  wrapperType:                        string;
  version:                            string;
  trackId:                            number;
  trackName:                          string;
  artistId:                           number;
  artistName:                         string;
  genres:                             string[];
  price:                              number;
  description:                        string;
  bundleId:                           string;
  averageUserRating:                  number;
  userRatingCount:                    number;
}
