import { useEffect, useRef, useState } from 'react'
import { useGameContext } from '@/providers'
import { marked } from 'marked'

export interface ChangelogTitle {
  version: string
  date: Date
}

export interface ChangelogEntry {
  title: ChangelogTitle
  content: string
}

export interface UseChangeLog {
  selectVersionIndex: (index: number) => void
  currentChangelog: ChangelogEntry | undefined
  versions: ChangelogTitle[]
  selectedVersionIndex: number
}

export const useChangelog = (): UseChangeLog => {
  const context = useGameContext()
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0)
  const [currentChangelog, setCurrentChangelog] = useState<ChangelogEntry | undefined>()
  const [versions, setVersions] = useState<Array<ChangelogTitle>>([])
  const lexedContent = useRef<marked.TokensList>()

  const getVersions = () => {
    const filteredContent = lexedContent.current!.filter((node) => {
      return node.type === 'heading' && node.depth === 2
    })

    const versionArray: Array<ChangelogTitle> = []
    for (const nodeVersion of filteredContent) {
      if (nodeVersion.type === 'heading' && !nodeVersion.text.startsWith('⚠')) {
        const version = nodeVersion.text
        const splitedVersion: Array<string> = version.split(' - ')
        const versionNumber = splitedVersion[0].replace(/^[[]+|[\]]+$/g, '')
        const versionDate = new Date(splitedVersion[1])
        versionArray.push({
          version: versionNumber,
          date: versionDate
        })
      }
    }
    return versionArray
  }

  const selectVersionIndex = (index: number): void => {
    const title = versions[index]

    if (!title) {
      return
    }
    console.log(title)
    setSelectedVersionIndex(index)

    const version = title.version
    let record: boolean = false
    const result: marked.TokensList = Object.assign([], { links: {} })

    for (const node of lexedContent.current!) {
      // Lors de la rencontre du titre recherché, on commence l'enregistrement pour stocker toute les lignes qui suivents
      // On stock au passage la version et la date que l'on va afficher au dessus du contenu.
      if (node.type === 'heading' && node.depth === 2 && node.text.indexOf(version) >= 0) {
        record = true
      }

      // On arrête l'enregistrement des lignes si on rencontre un deuxième titre
      if (node.type === 'heading' && node.depth === 2 && node.text.indexOf(version) === -1) {
        record = false
      }

      // Si l'enregistrement est actif, alors on stock la ligne dans un tableau
      if (record === true) {
        // Exclusion du titre car c'est fait manuellement
        if (node.type !== 'heading' || node.depth !== 2) {
          result.push(node)
        }
      }
    }

    setCurrentChangelog({ title, content: marked.parser(result) })
  }

  useEffect(() => {
    fetch(context.changeLogSrc)
      .then((res) => res.blob())
      .then((blob) => blob.text())
      .then((text) => {
        lexedContent.current = marked.lexer(text)
        const versions = getVersions()
        setVersions(versions)
        if (versions.length > 0) {
          selectVersionIndex(0)
        }
      })
  }, [])

  return { currentChangelog, selectVersionIndex, versions, selectedVersionIndex }
}
