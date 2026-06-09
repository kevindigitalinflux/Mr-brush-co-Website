import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

interface Props {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  delay?: number
}

/** Section heading that reveals word-by-word on scroll entry */
export function AnimatedHeading({ text, className = '', as: Tag = 'h2', delay = 0 }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const words = el.querySelectorAll<HTMLElement>('.word-inner')
    const ctx = gsap.context(() => {
      gsap.from(words, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        y: '115%',
        opacity: 0,
        rotationZ: 1.5,
        duration: 1.1,
        stagger: 0.045,
        ease: 'expo.out',
        delay,
      })
    })

    return () => ctx.revert()
  }, [delay])

  return (
    <Tag ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="overflow-hidden inline-block align-top mr-[0.3em] last:mr-0">
          <span className="word-inner inline-block">{word}</span>
        </span>
      ))}
    </Tag>
  )
}
