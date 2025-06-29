-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE container_status AS ENUM ('available', 'in_use', 'maintenance');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shippers table
CREATE TABLE public.shippers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    fax TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consignees table
CREATE TABLE public.consignees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    fax TEXT,
    email TEXT,
    usci TEXT, -- Unified Social Credit Identifier
    contact_person TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notify_parties table
CREATE TABLE public.notify_parties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    fax TEXT,
    email TEXT,
    usci TEXT, -- Unified Social Credit Identifier
    contact_person TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create containers table
CREATE TABLE public.containers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    container_number TEXT UNIQUE NOT NULL,
    container_type TEXT NOT NULL,
    size TEXT NOT NULL,
    status container_status DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shippers_updated_at BEFORE UPDATE ON public.shippers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consignees_updated_at BEFORE UPDATE ON public.consignees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notify_parties_updated_at BEFORE UPDATE ON public.notify_parties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_containers_updated_at BEFORE UPDATE ON public.containers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shippers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notify_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.containers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert users" ON public.users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete users" ON public.users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for shippers table
CREATE POLICY "Authenticated users can view shippers" ON public.shippers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert shippers" ON public.shippers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update shippers" ON public.shippers
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete shippers" ON public.shippers
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for consignees table
CREATE POLICY "Authenticated users can view consignees" ON public.consignees
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert consignees" ON public.consignees
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update consignees" ON public.consignees
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete consignees" ON public.consignees
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for notify_parties table
CREATE POLICY "Authenticated users can view notify parties" ON public.notify_parties
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert notify parties" ON public.notify_parties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update notify parties" ON public.notify_parties
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete notify parties" ON public.notify_parties
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for containers table
CREATE POLICY "Authenticated users can view containers" ON public.containers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert containers" ON public.containers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update containers" ON public.containers
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete containers" ON public.containers
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.shippers (name, address, phone, fax) VALUES
('DYY TRADING INTL CO., LTD.', '101 MOO 7 WIANG SUBDISTRICT, CHIANGSAEN DISTRICT CHIANGRAI 57150 THAILAND', '053-650066', '053-650066');

INSERT INTO public.consignees (name, address, phone, fax, email, usci, contact_person) VALUES
('BEIJING JUNYAO INTERNATIONAL', 'COURTYARD 2, JIAOGEZHUANG STREET NANFAXIN TOWN, SHUNYI DISTRICT, BEIJING, CHINA, 101300.', '0086-13911653846', '0086-13911653846', 'docs.list@bjncei.com, gm@bjncei.com', '91110113MA003ATG6P', 'Ms.Lv Huibin');

INSERT INTO public.notify_parties (name, address, phone, fax, email, usci, contact_person) VALUES
('BEIJING JUNYAO INTERNATIONAL', 'COURTYARD 2, JIAOGEZHUANG STREET NANFAXIN TOWN, SHUNYI DISTRICT, BEIJING, CHINA, 101300.', '0086-13911653846', '0086-13911653846', 'docs.list@bjncei.com, gm@bjncei.com', '91110113MA003ATG6P', 'Ms.Lv Huibin');

INSERT INTO public.containers (container_number, container_type, size, status) VALUES
('MSKU1234567', '20ft Standard', '20ft', 'available'),
('TCLU9876543', '40ft High Cube', '40ft', 'available'),
('GESU5555555', '20ft Refrigerated', '20ft', 'in_use');
