# 🎸 Chorde - Song Library Status

## Current Library Status

### ✅ Public Domain Collection

The repository ships with public domain and traditional songs only, so the project can be
distributed without copyright infringement risks. **Every seeded song is checked by a test**
(`packages/web/src/lib/__tests__/songValidation.test.ts`) - if a song without a public domain
licence is ever added, the build fails.

**16 songs, all public domain:**

| Song                           | Writer                    | Note                                               |
| ------------------------------ | ------------------------- | -------------------------------------------------- |
| Amazing Grace                  | Traditional hymn          | John Newton's words, 1779                          |
| Kumbaya                        | Traditional spiritual     |                                                    |
| Oh Susanna                     | Stephen Foster            | 1848                                               |
| Will the Circle Be Unbroken    | Traditional bluegrass     | Ada Randel, 1913, arranged by the Carter Family    |
| Oh My Darling Clementine       | Traditional folk          | 1881                                               |
| Greensleeves                   | Traditional English       | 1580                                               |
| House of the Rising Sun        | Traditional folk          | The Animals recorded it in 1964; the song is older |
| Down in the Valley             | Traditional American folk | Also known as Birmingham Jail                      |
| Wildwood Flower                | Traditional Carter Family |                                                    |
| Bury Me Beneath the Willow     | Traditional Carter Family | 1885                                               |
| I Am a Man of Constant Sorrow  | Traditional               | 1913                                               |
| Shady Grove                    | Traditional Appalachian   |                                                    |
| Cripple Creek                  | Traditional               |                                                    |
| I Ain't Got Nobody             | Traditional               | 1916                                               |
| This Little Light of Mine      | Traditional gospel        | 1920                                               |
| When the Saints Go Marching In | Traditional               | 1896                                               |

The seed data lives in `packages/web/src/data/`:

- `seedSongs.ts` - the traditional songs
- `rockPack.ts` - folk songs
- `rockPack2.ts` - more folk songs
- `mixPack.ts` - a mixed collection

## Strategy

### 1. Public Safe Repository

The public repository ships with **only public domain content**.

Two packs were removed because their licence was never clear: fifty jazz standards that were
marked as restricted, and three popular songs that had been labelled public domain but were not

- "Blowin' in the Wind" (Bob Dylan, 1962), "Leaving on a Jet Plane" (John Denver, 1971) and
  "He Ain't Heavy, He's My Brother" (Russell & Scott, 1968) are all still in copyright.

A song is only counted as public domain when the **song** is out of copyright, not merely when a
particular recording is.

### 2. User Imports

Users can import their own songs using the import features. This places the responsibility of
copyright compliance on the end-user for their personal library. Songs imported from a source
that does not declare a licence are shown a rights notice before they are added.

## Technical Notes

- **Seed Data**: `packages/web/src/data/*.ts` (public domain only).
- **Rights check**: `packages/web/src/lib/__tests__/songValidation.test.ts` fails the build if a
  seeded song is not public domain.
- **Import Features**: Users can import songs via the Import dialog (Paste/Drop, Search Online
  and From Folder tabs).
