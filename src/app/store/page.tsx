
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, Star, ShoppingBag, ChevronDown, User, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getReferenceBooks } from '@/app/actions';
import type { TReferenceBook } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useStoreAuth } from '@/context/store-auth-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { ToastAction } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';


export const StoreHeader = ({ searchTerm, setSearchTerm }: { searchTerm: string, setSearchTerm: (term: string) => void }) => {
    const { cartCount } = useCart();
    const { user: storeUser, logout: storeLogout } = useStoreAuth();
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = useCallback(() => {
        if (typeof window !== 'undefined') {
            if (window.scrollY > lastScrollY && window.scrollY > 80) { // if scroll down hide the navbar
                setShow(false);
            } else { // if scroll up show the navbar
                setShow(true);
            }
            setLastScrollY(window.scrollY);
        }
    }, [lastScrollY]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);

            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [controlNavbar]);
    
    const searchPopoverContent = (
      <div className="p-2 space-y-2">
        <p className="text-sm font-medium text-foreground">Search Store</p>
        <p className="text-xs text-muted-foreground">Find books by ID, class, or edition.</p>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-9 text-xs"
            />
        </div>
      </div>
    );


    return (
        <header className={cn("sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm transition-transform duration-300 h-14", show ? "translate-y-0" : "-translate-y-full")}>
            <div className="container flex h-14 items-center justify-between mx-auto px-4 md:px-[10%]">
                <Link href="/store" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="IDL Education Logo" width={24} height={24} />
                    <span className="text-lg font-bold text-primary">IDL Store</span>
                </Link>
                <div className="flex items-center gap-2 md:gap-4">
                     <Link href="/" className="md:hidden">
                        <Button variant="link" className="h-auto p-0 text-foreground font-semibold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                           HOME
                        </Button>
                    </Link>
                    <Link href="/" className="hidden md:block">
                        <Button variant="link" className="h-auto p-0 text-foreground font-semibold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                           HOME
                        </Button>
                    </Link>
                     <Separator orientation="vertical" className="h-3 bg-foreground/20" />
                    {storeUser ? (
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{storeUser.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">{storeUser.name}</p>
                              <p className="text-xs leading-none text-muted-foreground">{storeUser.mobile}</p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem asChild>
                                <Link href="/store/cart">My Cart</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/store/orders">My Orders</Link>
                            </DropdownMenuItem>
                           <DropdownMenuItem onClick={storeLogout}>
                            Logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                        <Button asChild variant="link" className="h-auto p-0 text-foreground font-semibold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                            <Link href="/store/auth">LOGIN</Link>
                        </Button>
                    )}
                    <Separator orientation="vertical" className="h-3 bg-foreground/20 hidden md:flex" />
                     <div className="flex items-center md:hidden gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-0">
                                {searchPopoverContent}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="h-4 w-4" /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-0">
                                {searchPopoverContent}
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
        </header>
    );
};


export default function StorePage() {
    const [books, setBooks] = useState<TReferenceBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useCart();
    const { toast } = useToast();
    const { user: storeUser } = useStoreAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            const result = await getReferenceBooks();
            if (result.success && result.data) {
                const storeBooks = (result.data as TReferenceBook[]).filter(book => book.category === 'IDL Store');
                setBooks(storeBooks);
                const classes = Array.from(new Set(storeBooks.map(b => b.class))).sort();
                if(classes.length > 0) {
                    setSelectedClass(classes.find(c => c.includes('10')) || classes[0]);
                }
            }
            setLoading(false);
        };
        fetchBooks();
    }, []);

    const classes = useMemo(() => Array.from(new Set(books.map(book => book.class))).sort(), [books]);
    
    const subjects = useMemo(() => ['All', ...Array.from(new Set(books.filter(book => book.class === selectedClass).map(book => book.subject)))], [books, selectedClass]);

    useEffect(() => {
        if (!subjects.includes(selectedSubject)) {
            setSelectedSubject('All');
        }
    }, [selectedClass, subjects, selectedSubject]);

    const filteredBooks = useMemo(() => {
        return books.filter(book => 
            (book.class === selectedClass) &&
            (selectedSubject === 'All' || book.subject === selectedSubject) &&
            (
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(book.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.edition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.class.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [books, selectedClass, selectedSubject, searchTerm]);

    const handleAddToCart = (book: TReferenceBook) => {
        if (!storeUser) {
            toast({
                title: "Please Log In",
                description: "You need to be logged in to add items to the cart.",
                action: <ToastAction altText="Login" onClick={() => router.push('/store/auth')}>Login</ToastAction>,
            });
            return;
        }
        addToCart(book);
        toast({
            title: "Added to Cart",
            description: `${book.title} has been added to your cart.`,
        });
    };
    
    const renderSkeleton = () => (
      <div className="flex gap-6 px-4 md:px-[10%]">
        {[...Array(4)].map((_, index) => (
            <div key={index} className="block flex-shrink-0 w-[280px]">
                <Skeleton className="h-[420px] w-full rounded-lg" />
            </div>
        ))}
      </div>
    );

    return (
        <>
            <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                <StoreHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className="container mx-auto py-12">
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">IDL Store</h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Your one-stop shop for the best reference books and study materials.
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-4 mb-8">
                         <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
                            <div className="flex justify-start md:justify-center gap-2 whitespace-nowrap px-4 sm:px-0">
                                {classes.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedClass(c)}
                                        className={cn(`py-2 px-6 text-sm font-medium transition-colors border rounded-full`,
                                            selectedClass === c
                                            ? 'border-primary text-primary bg-primary/10 shadow'
                                            : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        )}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                       <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
                            <div className="flex justify-start md:justify-center gap-2 whitespace-nowrap px-4 sm:px-0">
                                {subjects.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSubject(s)}
                                        className={cn(`py-1 px-4 text-xs font-medium transition-colors border rounded-full`,
                                            selectedSubject === s
                                            ? 'border-primary text-primary bg-primary/10' 
                                            : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                     
                    <div className="relative">
                         {loading ? (
                            renderSkeleton()
                         ) : (
                            <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                 <div className="flex gap-6 px-4 md:px-[10%]">
                                    {filteredBooks.map((book, index) => (
                                        <div key={book.id} className="block flex-shrink-0 w-[280px] group">
                                        <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up group rounded-lg bg-card flex flex-col h-full" style={{ animationDelay: `${index * 50}ms` }}>
                                            <CardContent className="p-3 flex flex-col flex-1">
                                                <div className="relative aspect-[4/5] w-full mb-3">
                                                    <GcsImage
                                                        filePath={book.imageUrl}
                                                        alt={book.title}
                                                        fill
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                    <span>{book.set}</span>
                                                    {book.productId && <span>ID: {book.productId}</span>}
                                                </div>
                                                <h3 className="font-bold text-sm leading-tight mt-1 flex-grow" title={book.title}>{book.title}</h3>
                                                
                                                <p className="text-xs font-semibold text-primary mt-1">
                                                    {book.class} | Edition: {book.edition}
                                                </p>
                                                
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < Math.round(book.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground font-semibold">{book.rating}</span>
                                                </div>
                                                
                                                <div className="flex items-baseline gap-1.5 mt-2">
                                                    <p className="text-lg font-bold text-foreground">₹{book.price}</p>
                                                    <p className="text-xs text-muted-foreground line-through">₹{book.originalPrice}</p>
                                                    <p className="text-xs font-semibold text-destructive">{Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% Off</p>
                                                </div>
                                                <div className="mt-3 flex gap-2">
                                                    <Button className="w-full h-9 text-xs" onClick={() => handleAddToCart(book)}>
                                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                                        Add To Cart
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
