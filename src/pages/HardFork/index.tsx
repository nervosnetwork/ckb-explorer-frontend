/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useMemo } from 'react'
import Squares from './Squares'
import styles from './styles.module.scss'
import glowingLine from './glowingLine.png'
import { InfiniteMovingCard } from './InfiniteMovingCard'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/Accordion'

const comments = [
  {
    name: 'Nervos CKB Docs',
    avatars: 'https://docs.nervos.org/img/logo-dark.png',
    content:
      'What is a Hard Fork? A hard fork is a significant update to a blockchain protocol that permanently diverges from its previous version. It introduces non-backward-compatible changes, requiring all network nodes to upgrade. If most nodes update successfully by the designated epoch number, the fork is deployed. Nodes running outdated versions lose connectivity, as they follow old rules that no longer apply.',
    date: '',
    link: 'https://docs.nervos.org/docs/history-and-hard-forks/intro-to-hard-fork',
  },
  {
    name: 'Nervos CKB Docs',
    avatars: 'https://docs.nervos.org/img/logo-dark.png',
    content:
      'Purpose of a Hard Fork: Nervos CKB implements hard forks to enhance the network’s functionality and security. These upgrades introduce new capabilities such as modified data structures, RISC-V extensions, and new syscalls. Hard forks also resolve critical issues, fix security vulnerabilities, and address protocol limitations that cannot be patched through backward-compatible updates, ensuring the long-term stability and growth of the platform.',
    date: '',
    link: 'https://docs.nervos.org/docs/history-and-hard-forks/intro-to-hard-fork',
  },
  {
    name: 'Nervos CKB Docs',
    avatars: 'https://docs.nervos.org/img/logo-dark.png',
    content:
      'CKB Hard Fork Process: The Nervos CKB hard fork process is divided into three phases. First, a proposal is created, discussed, and finalized, followed by implementation and local testing, taking about nine months. Next, the update is deployed on a public preview network and testnet for further stability testing. Finally, after a three-month preparation period, the fork is activated on the mainnet, ensuring a smooth transition.',
    date: '',
    link: 'https://docs.nervos.org/docs/history-and-hard-forks/intro-to-hard-fork',
  },
  {
    name: 'doitian',
    avatars: 'https://avatars.githubusercontent.com/u/35768?v=4',
    content:
      'MainNet: the 60 days ago block is: 14908742 \n0x216095bfc3bb68e7509db4b3f98b105ac5565586876a795a9c5c3d0dfe134cb5 in Sun Dec 22 03:04:27 PM CST 2024\nyou can view this block in https://explorer.nervos.org/block\n0x216095bfc3bb68e7509db4b3f98b105ac5565586876a795a9c5c3d0dfe134cb5.\nTestNet:the 60 days ago block is: 15641938 0xd92fe833fd53c6e0c7f05516609c3bbf4777aa05d016523cf1ff8aeaeec6fc13 in Sun Dec 22 03:09:16 PM CST 2024\nyou can view this block in https://pudge.explorer.nervos.org/block/0xd92fe833fd53c6e0c7f05516609c3bbf4777aa05d016523cf1ff8aeaeec6fc13',
    date: '',
    link: 'https://github.com/nervosnetwork/ckb/issues/4806#issuecomment-2673768017',
  },
  {
    name: 'doitian',
    avatars: 'https://avatars.githubusercontent.com/u/35768?v=4',
    content:
      'Improvements:\nNetRpcImpl::get_peers return Remoteaddress.addresses dedup #4795: NetRpcImpl::get_peers return Remoteaddress.addresses without duplicates (@eval-exec)\nThis is a breaking change of RPC.\nUpgrade openssl from 0.10.68 to 0.10.70, fix https://rustsec.org/advisories/RUSTSEC-2025-0004 #4801: Upgrade openssl from 0.10.68 to 0.10.70, fix RUSTSEC-2025-0004 (@eval-exec)\nImproving spawn and exec syscalls #4785: Improving spawn and exec syscalls (@mohanson)',
    date: '',
    link: 'https://github.com/nervosnetwork/ckb/issues/4806#issuecomment-2673786997',
  },
  {
    name: 'doitian',
    avatars: 'https://avatars.githubusercontent.com/u/35768?v=4',
    content:
      'Features\nchore: 2nd hardfork mainnet activation params #4807: Activate CKB Edition Meepo (2024) on the Mainnet (@zhangsoledad)\nThis is a breaking change of consensus once activated.\nfeat: impl filter with transport #4800: Implement nodes filter with P2P transport service types (@driftluo)\nfeat: mark dns address connected time on peer store #4793: Mark DNS address connected time on peer store (@driftluo)\nhttps://github.com/nervosnetwork/ckb/issues/4806#issuecomment-2673786997',
    date: '',
    link: 'https://github.com/nervosnetwork/ckb/issues/4806#issuecomment-2673786997',
  },
  {
    name: 'gpBlockchain',
    avatars: 'https://avatars.githubusercontent.com/u/3198439?v=4',
    content:
      'Third-party adaptation\nmainnet hardfork && improving spawn\nhttps://github.com/nervosnetwork/ckb-light-client.git @quake\nhttps://github.com/nervosnetwork/ckb-light-client/tree/develop/wasm @Officeyutong\nneuron\nimproving spawn\nhttps://github.com/nervosnetwork/ckb-testtool @XuJiandong @mohanson\nhttps://github.com/nervosnetwork/ckb-standalone-debugger @XuJiandong @mohanson',
    date: '',
    link: 'https://github.com/nervosnetwork/ckb/issues/4806#issuecomment-2677703878',
  },
  {
    name: 'CKB Consensus Change',
    avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
    content:
      'The Nervos CKB hardfork is a major protocol upgrade that results in a permanent divergence from the previous blockchain version. Unlike soft forks, which require only miner nodes to upgrade, a hardfork mandates that all nodes update to maintain consensus. This ensures a smooth transition while introducing essential new functionalities and security enhancements.',
    date: '',
    link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
  },
  {
    name: 'CKB Consensus Change',
    avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
    content:
      'Nervos CKB implements hardforks to introduce significant improvements. These include new functionalities such as modified data structures, RISC-V extensions, and new syscalls to enhance platform utility. Additionally, hardforks address security concerns by resolving critical issues and limitations that cannot be fixed through backward-compatible updates. The combination of these updates ensures long-term scalability and reliability.',
    date: '',
    link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
  },
  {
    name: 'CKB Consensus Change',
    avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
    content:
      'To prevent network instability from frequent upgrades, Nervos CKB follows a timing policy ensuring at least a one-year interval (2,190 epochs) between hardforks. This strategy allows each upgrade to be substantial and forward-compatible, providing developers with sufficient time for testing and adaptation while maintaining network stability.',
    date: '',
    link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
  },
  {
    name: 'CKB Consensus Change',
    avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
    content:
      'Each hardfork in Nervos CKB is referred to as an "edition," with names inspired by Dota heroes. The format follows "CKB Edition [Name] (Year)," such as CKB Edition Meepo (2025). Both mainnet and testnet share the same name, with suffixes added only when necessary. This convention maintains consistency across network upgrades.',
    date: '',
    link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
  },
  {
    name: 'CKB Consensus Change',
    avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
    content:
      'The first phase begins with the creation of a detailed hardfork proposal, followed by community discussions for feedback and refinement. The finalized proposal is published as an RFC. Development and initial testing then commence, adjusting the proposal as necessary. A hardfork-ready node version is released for local preview, along with updates to SDKs, explorers, and wallets. This phase typically takes around 9 months.',
    date: '',
    link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
  },
  {
    name: 'CKB Consensus Change',
    avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
    content:
      'A public preview network is deployed for further testing once implementation nears completion. The network is closely monitored for stability. Once deemed stable, the testnet undergoes a hardfork, including:\nNode binary release\nEpoch number announcement\nActivation at the specified epoch\nThe upgrade does not occur immediately but takes effect at the announced epoch. If the majority of nodes upgrade successfully, the hardfork is considered successfully deployed. Nodes running outdated versions will be unable to connect to the testnet post-hardfork.',
    date: '',
    link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
  },
  {
    name: 'CKB Consensus Change',
    avatars: 'https://www.svgrepo.com/show/243051/docs.svg',
    content:
      'The final phase mirrors the testnet deployment process. Once network participants are ready, the mainnet hardfork is initiated. Key steps include:\nRelease of the mainnet hardfork binary and activation epoch\nA preparation period of at least three months\nActivation upon majority node upgrade\n.Once activated at the specified epoch, the hardfork is deemed successfully deployed, marking the completion of the upgrade.',
    date: '',
    link: 'https://github.com/nervosnetwork/rfcs/blob/3a6ae4fa5d59b6e33fa7bd563d336706d135c0d8/rfcs/0053-ckb-hardfork/0053-ckb-hardfork.md',
  },
]

export default function CountdownPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 31,
    hours: 26,
    minutes: 53,
    seconds: 47,
  })

  const shuffledComments = useMemo(
    () =>
      comments
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value),
    [],
  )

  // const [isVMExpanded, setIsVMExpanded] = useState(false)
  // const [isSpawnExpanded, setIsSpawnExpanded] = useState(false)
  // const [isFeeExpanded, setIsFeeExpanded] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.countdownPage}>
      <div className={styles.glowingLineContainer}>
        <img className={styles.glowingLine} src={glowingLine} alt="line" />
      </div>
      <div className={styles.squaresBg}>
        <Squares
          speed={0.1}
          squareSize={24}
          direction="down" // up, down, left, right, diagonal
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>

      <main className={styles.mainContainer}>
        <h1 className={styles.mainTitle}>NEXT HARDFORK OF CKB</h1>

        <div className={styles.countdownSection}>
          <p className={styles.comingSoon}>COMING SOON</p>

          {/* Countdown timer */}
          <div className={styles.countdownTimer}>
            <div className={styles.timerBlock}>
              <div className={styles.timerValue}>{timeLeft.days.toString().padStart(2, '0')}</div>
              <div className={styles.timerLabel}>DAYS</div>
            </div>
            <div className={styles.timerBlock}>
              <div className={styles.timerValue}>{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className={styles.timerLabel}>HOURS</div>
            </div>
            <div className={styles.timerBlock}>
              <div className={styles.timerValue}>{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className={styles.timerLabel}>MINUTES</div>
            </div>
            <div className={styles.timerBlock}>
              <div className={styles.timerValue}>{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className={styles.timerLabel}>SECONDS</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '25%' }} />
            </div>
            <div className={styles.progressMarkers}>
              <span style={{ opacity: 0 }}>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span style={{ opacity: 0 }}>100%</span>
            </div>
          </div>
        </div>

        <InfiniteMovingCard
          items={shuffledComments.slice(0, shuffledComments.length / 2)}
          direction="left"
          speed="slow"
        />
        <InfiniteMovingCard
          items={shuffledComments.slice(shuffledComments.length / 2)}
          direction="right"
          speed="slow"
        />

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>CKB-VM V2</AccordionTrigger>
            <AccordionContent>
              <p>
                One notable addition is the inclusion of a new system call called "Spawn," which can be further explored
                in the RFC50: CKB-VM Syscalls 3. In essence, Spawn serves as an alternative to dynamic library calls and
                Exec. With Spawn, a Script can create a child Script with an independent memory area, and data can be
                passed between the parent and child Scripts without restriction.
              </p>
              <p>Implemented more macro-op fusions to reduce cycle consumption, making Scripts run more efficiently.</p>
              <p>
                Added a new data2 value in the Scripthash_type field to smoothly manage different VM versions, ensuring
                a seamless upgrade path.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Spawn: Direct Cross-Script Calling</AccordionTrigger>
            <AccordionContent>
              <p>
                One notable addition is the inclusion of a new system call called "Spawn," which can be further explored
                in the RFC50: CKB-VM Syscalls 3. In essence, Spawn serves as an alternative to dynamic library calls and
                Exec. With Spawn, a Script can create a child Script with an independent memory area, and data can be
                passed between the parent and child Scripts without restriction.
              </p>
              <p>Implemented more macro-op fusions to reduce cycle consumption, making Scripts run more efficiently.</p>
              <p>
                Added a new data2 value in the Scripthash_type field to smoothly manage different VM versions, ensuring
                a seamless upgrade path.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Fee Estimator</AccordionTrigger>
            <AccordionContent>
              <p>
                One notable addition is the inclusion of a new system call called "Spawn," which can be further explored
                in the RFC50: CKB-VM Syscalls 3. In essence, Spawn serves as an alternative to dynamic library calls and
                Exec. With Spawn, a Script can create a child Script with an independent memory area, and data can be
                passed between the parent and child Scripts without restriction.
              </p>
              <p>Implemented more macro-op fusions to reduce cycle consumption, making Scripts run more efficiently.</p>
              <p>
                Added a new data2 value in the Scripthash_type field to smoothly manage different VM versions, ensuring
                a seamless upgrade path.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  )
}
