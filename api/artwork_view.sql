use thecommercial;
-- This query gets the required data to display in detail an artwork

-- Returns the following values

-- first_name
-- last_name
-- title
-- year
-- thumb_url
-- image_url
-- height
-- width
-- depth
-- non_standard_dimensions
-- description
-- edition_caption
-- collection_caption
-- medium_descriptive

-- artist_id
-- artwork_profile_id

select artwork_t1.*, concat('https://www.thecommercialgallery.com', thumb_url) thumb_url, concat('https://www.thecommercialgallery.com', image_url) image_url, FM.caption img_caption, FI.width img_width, FI.height img_height, FM.name img_name
from
(
select height, width, depth, non_standard_dimensions , year_from year, AWP.description, edition_caption, collection_caption, title, medium_descriptive, first_name, last_name, artist_id, AWP.id artwork_profile_id
from artwork_profiles AWP
inner join artists A
on A.id = AWP.artist_id
where AWP.id = 3210
) artwork_t1
left join artworkprofiles_files AWPF
on artwork_t1.artwork_profile_id = AWPF.artwork_profile_id
left join file_managed FM
on AWPF.file_id = FM.id
left join files_images FI
on FM.id = FI.file_manage_id
