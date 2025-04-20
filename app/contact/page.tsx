"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/auth-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Mail, Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

type FormValues = z.infer<typeof formSchema>

const faqs = [
  {
    question: "What is CollegeSphere?",
    answer:
      "CollegeSphere is a platform that provides AI-powered college predictions based on JOSAA counseling trends. We offer detailed college insights, rankings, and 1:1 mentorship from top IITians.",
  },
  {
    question: "How accurate are the college predictions?",
    answer:
      "Our predictions are based on historical data and advanced algorithms. While we strive for accuracy, predictions are estimates and not guarantees.",
  },
  {
    question: "How can I recharge credits?",
    answer:
      "You can recharge credits by clicking on the 'Recharge Credits' button in your dashboard. We offer various packages to suit your needs.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We currently accept payments through Cashfree, Razorpay and other UPI methods.",
  },
  {
    question: "How can I contact support?",
    answer: "You can contact our support team by filling out the contact form on this page or emailing us directly.",
  },
]

export default function ContactPage() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  // Initialize form with user data if available
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      subject: "",
      category: "",
      message: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Create submission data without user_id
      const submissionData = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        category: data.category,
        message: data.message,
        status: "new",
      }

      // If user is logged in and has an ID, add it to the submission
      if (user && user.id) {
        // Create a new submission record with the user's ID
        const { error } = await supabase.from("contact_submissions").insert({
          ...submissionData,
          user_id: user.id,
        })

        if (error) {
          console.error("Supabase error details:", error)
          throw error
        }
      } else {
        // Create a new submission record without a user ID
        // This will use the database's default value for user_id
        const { error } = await supabase.from("contact_submissions").insert(submissionData)

        if (error) {
          console.error("Supabase error details:", error)
          throw error
        }
      }

      setIsSuccess(true)
      form.reset({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        category: "",
        message: "",
      })
    } catch (err: any) {
      console.error("Error submitting form:", err)
      setError(`There was an error submitting your message: ${err.message || "Unknown error"}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewMessage = () => {
    setIsSuccess(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help! Fill out the form below and our team will get back
              to you as soon as possible.
            </p>
          </div>

          {isSuccess ? (
            <div className="max-w-md mx-auto bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Message Sent Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for reaching out. We've received your message and will respond as soon as possible.
              </p>
              <Button onClick={handleNewMessage}>Send Another Message</Button>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {error && (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                  <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email address" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Subject of your message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="payment">Payment Issue</SelectItem>
                            <SelectItem value="credits">Credits & Recharge</SelectItem>
                            <SelectItem value="counseling">Counseling Services</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your message" className="min-h-32" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Card with Infographic */}
            <div className="bg-card border border-blue-100 dark:border-blue-900 rounded-lg p-6 text-center hover:shadow-md transition-all group">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Mail className="h-8 w-8" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <div className="flex justify-center mb-3">
                <div className="relative w-10 h-6 bg-blue-100 dark:bg-blue-900 rounded">
                  <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-sm"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-3 border-t-2 border-blue-500 rounded-t-full"></div>
                </div>
              </div>
              <p className="text-blue-700 dark:text-blue-300 font-medium mb-1">collegesphere25@gmail.com</p>
              <p className="text-xs text-muted-foreground">For all inquiries, including support and feedback</p>
            </div>

            {/* Response Time Card with Infographic */}
            <div className="bg-card border border-green-100 dark:border-green-900 rounded-lg p-6 text-center hover:shadow-md transition-all group">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Response Time</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-3">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full w-3/4"></div>
              </div>
              <p className="text-green-700 dark:text-green-300 font-medium mb-1">Within 24 Hours</p>
              <p className="text-xs text-muted-foreground">
                We strive to respond to all inquiries as quickly as possible
              </p>
            </div>

            {/* Operating Hours Card with Infographic */}
            <div className="bg-card border border-amber-100 dark:border-amber-900 rounded-lg p-6 text-center hover:shadow-md transition-all group">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Calendar className="h-8 w-8" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Operating Hours</h3>
              <div className="flex justify-center space-x-1 mb-3">
                {["M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 text-xs flex items-center justify-center rounded-sm ${i < 6 ? "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}
                  >
                    {day}
                  </div>
                ))}
                <div className="w-5 h-5 text-xs flex items-center justify-center rounded-sm bg-gray-100 dark:bg-gray-800 text-gray-400">
                  Su
                </div>
              </div>
              <p className="text-amber-700 dark:text-amber-300 font-medium mb-1">Monday - Saturday, 9AM - 6PM</p>
              <p className="text-xs text-muted-foreground">Indian Standard Time (GMT+5:30)</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
