import { type FC } from 'react'

import { useQuery } from '@tanstack/react-query'
import { type NFTCollection, type NFTItem } from '../../../services/ExplorerService'
import { ReactComponent as CoverIcon } from '../../../assets/nft_cover.svg'
import { handleNftImgError, patchMibaoImg } from '../../../utils/util'
import { getSporeImg } from '../../../utils/spore'
import { DEFAULT_SPORE_IMAGE } from '../../../constants/common'
import styles from './styles.module.scss'

const Cover: FC<{ item: NFTItem; info?: NFTCollection; size?: 'lg' | 'md' | 'sm' }> = ({ item, info, size = 'lg' }) => {
  const dobRenderParams =
    item?.standard === 'spore' && item.cell?.data
      ? {
          data: item.cell.data,
          id: item.type_script.args,
        }
      : null

  const { data: dobImg, isLoading } = useQuery({
    queryKey: ['dob_render_img', dobRenderParams],
    queryFn: () => (dobRenderParams ? getSporeImg(dobRenderParams) : DEFAULT_SPORE_IMAGE),
    enabled: !!dobRenderParams,
  })

  if (item?.standard === 'spore') {
    return (
      <img
        src={isLoading ? DEFAULT_SPORE_IMAGE : dobImg}
        alt="cover"
        loading="lazy"
        className={styles.cover}
        data-size={size}
      />
    )
  }

  const coverUrl = item.icon_url ?? info?.icon_url

  if (coverUrl) {
    return (
      <img
        src={`${patchMibaoImg(coverUrl)}?size=small&tid=${item.token_id}`}
        alt="cover"
        loading="lazy"
        className={styles.cover}
        onError={handleNftImgError}
        data-size={size}
      />
    )
  }

  return <CoverIcon className={styles.cover} />
}

export default Cover
