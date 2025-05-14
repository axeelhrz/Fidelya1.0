'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import type { AosOptions } from 'aos'
import "aos/dist/aos.css"
import Header from "@/components/ui/header"
import Footer from "@/components/ui/footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-in-out",
    } as AosOptions)
  }, [])

  return (
    <>
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </>
  )
}