import { type FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DEFAULT_SPORE_IMAGE } from '../../../constants/common'
import { NFTItem } from '../../../services/ExplorerService'
import { getSporeImg } from '../../../utils/spore'
import { handleNftImgError, patchMibaoImg } from '../../../utils/util'
import { ReactComponent as CoverIcon } from '../../../assets/nft_cover.svg'
import styles from './styles.module.scss'

const Cover: FC<{
  item: NFTItem | null
}> = ({ item }) => {
  const dobRenderParams =
    item?.standard === 'spore' && item.cell?.data
      ? {
          data: item.cell.data,
          id: item.type_script.args,
        }
      : null

  const { data: dobRenderImage, isLoading } = useQuery({
    queryKey: ['dob_render_img', dobRenderParams],
    queryFn: () => (dobRenderParams ? getSporeImg(dobRenderParams) : DEFAULT_SPORE_IMAGE),
    enabled: !!dobRenderParams,
  })

  if (item?.standard === 'spore') {
    return (
      <img src={isLoading ? DEFAULT_SPORE_IMAGE : dobRenderImage} alt="cover" loading="lazy" className={styles.cover} />
    )
  }

  const url = item?.icon_url || item?.collection.icon_url
  if (url) {
    return (
      <img
        src={`${patchMibaoImg(url)}?size=medium&tid=${item?.token_id}`}
        alt="cover"
        loading="lazy"
        className={styles.cover}
        onError={handleNftImgError}
      />
    )
  }

  return <CoverIcon className={styles.cover} />
}

export default Cover
