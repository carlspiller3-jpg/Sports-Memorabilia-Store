-- Allow public insert/update access for demo purposes
CREATE POLICY "Allow public insert access on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on products" ON public.products FOR UPDATE USING (true);

CREATE POLICY "Allow public insert access on variants" ON public.variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on variants" ON public.variants FOR UPDATE USING (true);
