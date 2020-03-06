use thecommercial;
-- This query gets the required data to display a list of all available works

-- Returns the following values

-- first_name
-- last_name
-- title
-- year
-- thumb_url
-- image_url

-- price
-- price_tile   (prices as a ranking from 1 - 101)
-- size         (sizes as a ranking from 1 - 101)

-- artist_id
-- artwork_id
-- artwork_profile_id
-- collection_id

select available_works_t6.*, ntile(101) over (order by price) price_tile, ntile(101) over (order by size) size_tile
from
(
select available_works_t5.*, max(AWHP.list_price) price
from
(
select available_works_t4.*, if(thumb_url is null, 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSG8YmmaJFVPwxwNtVDK0ASJ1IUA7IXPjp0_iWsxG6uFVOZ4SSa', concat('https://www.thecommercialgallery', thumb_url)) thumb_url, if(image_url is null, 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSG8YmmaJFVPwxwNtVDK0ASJ1IUA7IXPjp0_iWsxG6uFVOZ4SSa', concat('https://www.thecommercialgallery', image_url)) image_url
from
(
select available_works_t3.*, AWP.title, AWP.year_from year, AWP.profile_img, AWP.width * AWP.height size
from
(
select available_works_t2.*, artwork_profile_id, artwork_id from
(
select available_works_t1.*, first_name, last_name
from
(
select collection_id, artist_id from collections C
inner join collections_artists CA
on C.id = CA.collection_id
where C.title = "Selected available works"
) available_works_t1
inner join artists A
on available_works_t1.artist_id = A.id
where A.is_public = 1
) available_works_t2
inner join collections_artworks CAW
on available_works_t2.collection_id = CAW.collection_id
) available_works_t3
inner join artwork_profiles AWP
on available_works_t3.artwork_profile_id = AWP.id
) available_works_t4
left join files_images FIMG
on available_works_t4.profile_img = FIMG.file_manage_id
) available_works_t5
left join artwork_historic_prices AWHP
on available_works_t5.artwork_id = AWHP.artwork_id
group by first_name, last_name, available_works_t5.artist_id, available_works_t5.collection_id, available_works_t5.artwork_profile_id, available_works_t5.artwork_id, available_works_t5.title, available_works_t5.year, available_works_t5.size, thumb_url, image_url
) available_works_t6

-- ADDITIONAL FILTERING

  -- Appennd for filtering of artists by artist_id, replace %PARAMS% with array of artist_id's
  where artist_id in %PARAMS%;

  -- Append for filtering of sizes, replace %PARAMS% with 0 > MIN < 101 and 1 > MAX <= 101 respectivly
  where size_tile BETWEEN %PARAMS% and %PARAMS%;

  -- Append for filtering of prices, replace %PARAMS% with 0 > MIN < 101 and 1 > MAX <= 101 respectivly
  where price_tile BETWEEN %PARAMS% and %PARAMS%;

  -- Append for filtering of types and replace %PARAMS% with types
  left join artworkprofiles_types AWPT
  on AWPT.artwork_profile_id = available_works_t6.artwork_profile_id
  where type_id in %PARAMS%
  group by collection_id, artist_id, first_name, last_name, artwork_profile_id, artwork_id, title, year, profile_img, size, thumb_url, image_url, price;
